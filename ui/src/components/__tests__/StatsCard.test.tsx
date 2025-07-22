import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
    it('renders stats card with label and value', () => {
        render(
            <StatsCard
                label="Total Patients"
                value={42}
                icon="👥"
                trend={{ value: 5, isPositive: true }}
            />
        );

        expect(screen.getByText('Total Patients')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('👥')).toBeInTheDocument();
    });

    it('displays positive trend correctly', () => {
        render(
            <StatsCard
                label="New Patients"
                value={10}
                icon="📈"
                trend={{ value: 3, isPositive: true }}
            />
        );

        expect(screen.getByText('+3')).toBeInTheDocument();
    });

    it('displays negative trend correctly', () => {
        render(
            <StatsCard
                label="Pending Visits"
                value={5}
                icon="⏳"
                trend={{ value: 2, isPositive: false }}
            />
        );

        expect(screen.getByText('-2')).toBeInTheDocument();
    });

    it('renders without trend when not provided', () => {
        render(
            <StatsCard
                label="Total Visits"
                value={100}
                icon="🏥"
            />
        );

        expect(screen.getByText('Total Visits')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('🏥')).toBeInTheDocument();

        // Should not have trend indicators
        expect(screen.queryByText(/[+-]\d+/)).not.toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
        render(
            <StatsCard
                label="Emergencies"
                value={0}
                icon="🚨"
                trend={{ value: 0, isPositive: true }}
            />
        );

        expect(screen.getByText('Emergencies')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('applies correct CSS classes for styling', () => {
        const { container } = render(
            <StatsCard
                label="Test"
                value={1}
                icon="🧪"
            />
        );

        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass('bg-hospitalWhite');
    });
});